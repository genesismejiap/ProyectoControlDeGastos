import os
import glob

images = glob.glob("extracted_assets/images/*.*")
print(f"Total extracted: {len(images)}")
# Print first 30 with size
for img in sorted(images)[:30]:
    size_kb = os.path.getsize(img) // 1024
    print(f"{os.path.basename(img)} - {size_kb} KB")
