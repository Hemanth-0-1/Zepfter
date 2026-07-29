# Zepfter — Pharma IT Solutions Website

Static corporate website for **Zepfter Pvt. Ltd.**, a pharmaceutical IT consulting and solutions company.

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- Google Fonts (Space Grotesk, Inter)
- Remix Icon CDN
- FormSubmit for contact form delivery

## Local Development

Serve the project root with any static file server:

```powershell
cd D:\zepfter
python -m http.server 8080
```

Open [http://localhost:8080/index.html](http://localhost:8080/index.html)

## Project Structure

```
zepfter/
├── index.html          Homepage
├── about.html          Company overview
├── services.html       8-tab service catalog
├── industries.html     Industry verticals
├── products.html       Product suite
├── clients.html        Clients & testimonials
├── insights.html       Blog listing
├── contact.html        Contact form
├── privacy.html        Privacy policy
├── terms.html          Terms of use
├── cookies.html        Cookie policy
├── insights/           Individual article pages
├── assets/             SVG images & favicon
├── css/style.css       Design system
├── js/
│   ├── config.js       Site configuration
│   └── main.js         All interactions
├── robots.txt
└── sitemap.xml
```

## Configuration

Edit `js/config.js` to update:

- Company email and phone
- FormSubmit endpoint (`formEndpoint`)
- Social media URLs

After changing the FormSubmit email, activate it via the confirmation link sent to that address.

## Deployment

Deploy the entire folder to any static host (Netlify, Vercel, GitHub Pages, Azure Static Web Apps, S3).

Update `sitemap.xml` and `robots.txt` with your production domain before launch.

## License

© 2026 Zepfter Pvt. Ltd. All rights reserved.
