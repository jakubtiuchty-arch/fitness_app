import { useWorkoutStore } from '../store/workoutStore';

// Google Fit OAuth configuration
// You'll need to set up a Google Cloud project and enable the Fitness API
// Then create OAuth 2.0 credentials and add these values
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin;
const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.write',
  'https://www.googleapis.com/auth/fitness.activity.read'
].join(' ');

export function GoogleFitButton() {
  const { connectGoogleFit } = useWorkoutStore();

  const handleGoogleFitConnect = () => {
    if (!GOOGLE_CLIENT_ID) {
      alert('Google Fit nie jest jeszcze skonfigurowany. Dodaj VITE_GOOGLE_CLIENT_ID do zmiennych środowiskowych.');
      return;
    }

    // Build OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('scope', GOOGLE_SCOPES);
    authUrl.searchParams.set('include_granted_scopes', 'true');
    authUrl.searchParams.set('state', 'fitness_connect');

    // Redirect to Google OAuth
    window.location.href = authUrl.toString();
  };

  // Check for OAuth callback on component mount
  if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get('access_token');
    const state = params.get('state');

    if (accessToken && state === 'fitness_connect') {
      connectGoogleFit(accessToken);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  return (
    <button className="google-fit-button" onClick={handleGoogleFitConnect}>
      <svg viewBox="0 0 24 24" width="20" height="20" className="google-fit-icon">
        <path
          fill="#EA4335"
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        />
        <path
          fill="#fff"
          d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm2.5 9h-5c-.28 0-.5-.22-.5-.5v-5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v5c0 .28-.22.5-.5.5z"
        />
      </svg>
      <span>Połącz z Google Fit</span>
    </button>
  );
}

// Helper function to sync workout to Google Fit
export async function syncWorkoutToGoogleFit(
  accessToken: string,
  workoutData: {
    startTime: string;
    endTime: string;
    activityType: string;
    calories?: number;
  }
) {
  const startTimeMillis = new Date(workoutData.startTime).getTime();
  const endTimeMillis = new Date(workoutData.endTime).getTime();

  // Map workout types to Google Fit activity types
  const activityTypeMap: Record<string, number> = {
    A: 80, // Strength training
    B: 80, // Strength training
    AEROBY: 8 // Running
  };

  const activityType = activityTypeMap[workoutData.activityType] || 0;

  const sessionData = {
    id: `fitness-tracker-${startTimeMillis}`,
    name: `Trening ${workoutData.activityType}`,
    description: 'Workout from FitTrack app',
    startTimeMillis,
    endTimeMillis,
    activityType,
    application: {
      name: 'FitTrack',
      version: '1.0.0'
    }
  };

  try {
    const response = await fetch(
      `https://www.googleapis.com/fitness/v1/users/me/sessions/${sessionData.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      }
    );

    if (!response.ok) {
      throw new Error('Failed to sync to Google Fit');
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing to Google Fit:', error);
    throw error;
  }
}
