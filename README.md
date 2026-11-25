# Jonathan Bentham – Portfolio

Static portfolio site (plain HTML/CSS/JS), hosted on GitHub Pages.

## Structure

- `index.html` – home page / project list
- `about.html` – about me and education
- `zombie-game.html`, `car-game.html`, `sound-wave-game.html`, `car-product-configurator.html` – project pages
- `assets/style.css` – all styling (colours are CSS variables at the top)
- `assets/site.js` – mobile menu, slideshows, play-on-scroll clips
- `assets/clips/` – gameplay clips (converted from GIFs to MP4 for size) + poster frames
- `assets/img/` – screenshots and stills
- `assets/video/` – Little Island video
- `assets/JonathanBenthamCV.pdf` – CV (replace this file to update the CV link)

## Editing

Edit the HTML directly and push; GitHub Pages redeploys automatically within a minute or two.

To add a gameplay GIF as a clip, convert it with ffmpeg:

```
ffmpeg -i my.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 26 -an assets/clips/my.mp4
ffmpeg -i my.gif -vframes 1 assets/clips/my.jpg
```

## Preview locally

```
python -m http.server 8000
```

Then open http://localhost:8000/index.html.
