# Ce N'est Pas Un Chien. Generative Film 02 by Antonio De Nuevo (2025)

This browser-based film blends over 1,200 cutouts using canvas rendering and real-time layering, synchronised to a fixed soundtrack.
All imagery is pre-generated; no Python backend is required to run.

# Extracting the frames from the original film
I created a Python script (`extract_faces.py`) that uses a zero-shot object detection model (OWL-ViT) to identify and isolate human faces in each frame of the original film.  
Each detected face is saved as a transparent PNG cutout, keeping its original screen position.  
These cutouts are later used to compose the film dynamically in the browser. 

# How to run the film
Just open index.html in a browser.

# Un Chien Andalou
Ce N'est Pas Un Chien is an interpolation of 1929 film Un Chien Andalou by Luis Buñuel and Salvador Dalí.
The original film has been processed by an image recognition ML model. All face cutouts appear in the same sequence as they do in the original film.

[![Watch on YouTube](https://img.youtube.com/vi/W8yKT7H_KJ0/hqdefault.jpg)](https://www.youtube.com/watch?v=W8yKT7H_KJ0)

# The Soundtrack
The soundtrack of the film uses a composition of mine called Tossing And Turning, originally featured on my album Close To The Light (2023).

You can listen to it here:
https://antoniodenuevo.bandcamp.com/album/close-to-the-light-a-collection


