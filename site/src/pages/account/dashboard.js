import React from 'react';
import { navigate } from 'gatsby';

async function checkLogin(setLoginStatus) {
  const { loggedIn = false } = await fetch('/api/check-auth').then((res) =>
    res.json(),
  );

  setLoginStatus(loggedIn);
}

async function logout() {
  const { status } = await fetch('/api/logout').then((res) => res.json());

  if (status !== 'ok') {
    throw new Error(status);
  }

  navigate('/login');
}

export default function Dashboard() {
  const [loginStatus, setLoginStatus] = React.useState();

  React.useEffect(() => {
    checkLogin(setLoginStatus);
  }, []);

  if (loginStatus === false) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <>
      <div>Secret</div>
      <button onClick={logout}>Logout</button>
    </>
  );
}
