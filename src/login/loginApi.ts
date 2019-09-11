export async function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const newScript = document.createElement("script");
    newScript.onerror = (err: any) => {
      console.error(err);
      reject();
    };
    newScript.onload = () => resolve();

    document.head.appendChild(newScript);
    newScript.src = url;
  });
}

export async function loadAuth2(timeout?: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject("GAPI not loaded.");
      return;
    }

    window.gapi.load("auth2", {
      callback: () => resolve(),
      onerror: (err: any) => {
        console.error(err);
        reject();
      },
      timeout,
      ontimeout: timeout
        ? () => {
            console.error("loadAuth2 timeout");
            reject("timeout");
          }
        : undefined
    });
  });
}

export function signIn(): void {
  if (window.gapi && window.gapi.auth2) {
    window.gapi.auth2.getAuthInstance().signIn({
      scope: ""
    });
  }
}

export function signOut(): void {
  if (window.gapi && window.gapi.auth2) {
    window.gapi.auth2.getAuthInstance().signOut();
  }
}

export async function getIdToken(): Promise<string | null> {
  if (!window.gapi || !window.gapi.auth2) {
    return null;
  }

  const user = window.gapi.auth2.getAuthInstance().currentUser.get();
  const authResponse = user.getAuthResponse(true);
  const time = new Date().getTime();

  if (!authResponse) {
    return null;
  }

  if (time > authResponse.expires_at - 60000) {
    try {
      const newAuthResponse = await user.reloadAuthResponse();
      return newAuthResponse.id_token;
    } catch (_) {
      return null;
    }
  }

  return authResponse.id_token;
}
