export async function OTPSignIn(passcode: number) {
  const res = await fetch("http://localhost/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ passcode: passcode }),
  });

  if (res.status === 200) {
    const URL = res.headers.get("Location") || "Page/Home";
    window.location.href = URL;
  }
}
