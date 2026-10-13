import glob
import os
import shutil

# Let's inspect images in assets/images/services
services_files = glob.glob("assets/images/services/*.*")
for sf in sorted(services_files):
    print(f"{os.path.basename(sf)} -> {os.path.getsize(sf)//1024} KB")
