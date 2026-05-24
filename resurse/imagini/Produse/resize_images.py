import os
from PIL import Image

def resize_images(target_width=300):
    for filename in os.listdir('.'):
        if filename.endswith(('.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP')):
            base_name, ext = os.path.splitext(filename)
            try:
                with Image.open(filename) as img:
                    # Maintain aspect ratio
                    wpercent = (target_width / float(img.size[0]))
                    target_height = int((float(img.size[1]) * float(wpercent)))
                    img_resized = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
                    
                    webp_name = base_name + '.webp'
                    
                    # Convert to RGB if necessary before saving as WebP
                    if img_resized.mode in ("RGBA", "P"):
                        img_resized = img_resized.convert("RGBA")
                    else:
                        img_resized = img_resized.convert("RGB")
                    
                    img_resized.save(webp_name, 'WEBP')
                    print(f"Resized and saved {filename} -> {webp_name}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")
            
            # Remove original if it wasn't a webp to begin with, 
            # or if it was webp, the save above overwrote it cleanly.
            if filename != webp_name:
                try:
                    os.remove(filename)
                    print(f"Deleted original file: {filename}")
                except Exception as e:
                    print(f"Error deleting {filename}: {e}")

if __name__ == '__main__':
    resize_images()
