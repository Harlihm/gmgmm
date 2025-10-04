export async function GET() {
  const appUrl = "https://mini-app-template-ebon.vercel.app";

  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjI1NjUwMCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDhhNkNhMGY0OThFZTQ1YjVCY2MyRTYwRUFBNjhmOTJmOTNCZURmQUYifQ",
      payload: "eyJkb21haW4iOiJnbWdtbS52ZXJjZWwuYXBwIn0",
      signature:
        "MHhjNWM0ZjhhNWY1NDI4YTg5OGE3NGFlOTZlNDgxNDg5OTQyM2Q3YjBkNTY1MDM5NjgxZDYwNTNhZDhhZjdhMGQ5MWIwY2EyMTdmMjQ3MTg0YzgxNmU4MzIzZGViZWVjZjQ2Mzg1NmFkMGI5MTkyY2FkMzVlNWMzZjc0YTkyOWEwYTFj",
    },
    frame: {
      version: "1",
      name: "Mini App Template",
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/opengraph-image`,
      buttonTitle: "Launch Frame",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#f7f7f7",
      webhookUrl: `${appUrl}/api/webhook`,
    },
  };

  return Response.json(config);
}
