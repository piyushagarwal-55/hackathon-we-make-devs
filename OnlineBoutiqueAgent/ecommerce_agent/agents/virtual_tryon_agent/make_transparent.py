from PIL import Image
import numpy as np

img = Image.open("image.png").convert("RGBA")
arr = np.array(img)

# turn near-black pixels transparent
r,g,b,a = arr.T
mask = (r<15) & (g<15) & (b<15)
arr[...,3][mask.T] = 0

Image.fromarray(arr).save("sunglasses_fixed.png")
print("Saved sunglasses_rgba.png")
