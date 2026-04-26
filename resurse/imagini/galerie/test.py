from PIL import Image
import os
import shutil

TARGET_WIDTH = 400
TARGET_HEIGHT = 400

BACKUP_FOLDER = "original_images"

os.makedirs(BACKUP_FOLDER, exist_ok=True)

for filename in os.listdir("."):
    if filename.lower().endswith(".webp"):
        original_path = filename
        backup_path = os.path.join(BACKUP_FOLDER, filename)

        # Move original first
        shutil.move(original_path, backup_path)

        with Image.open(backup_path) as img:
            # Ensure alpha channel is preserved
            img = img.convert("RGBA")

            # Resize proportionally
            img.thumbnail((TARGET_WIDTH, TARGET_HEIGHT), Image.LANCZOS)

            # Transparent canvas
            new_img = Image.new("RGBA", (TARGET_WIDTH, TARGET_HEIGHT), (0, 0, 0, 0))

            # Center image
            x = (TARGET_WIDTH - img.width) // 2
            y = (TARGET_HEIGHT - img.height) // 2

            new_img.paste(img, (x, y), img)

            # Save with high quality + transparency
            new_img.save(
                filename,
                "WEBP",
                lossless=True,   # best quality, keeps sharp edges + alpha
                method=6         # slower but better compression
            )

        print(f"Processed: {filename} (original moved to {BACKUP_FOLDER}/)")
