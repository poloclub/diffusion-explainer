import os 
from PIL import Image

def compress(dir, save_dir="./", filename=""):
    if filename == "":
        # compress all the images
        print(os.listdir(dir))
        for folder_name in os.listdir(dir):
            if folder_name == ".DS_Store": continue
            print("Start compressing the folder", folder_name)
            folder_path = os.path.join(dir, folder_name, "scheduled")
            save_path = os.path.join(save_dir, folder_name, "scheduled")
            if not os.path.exists(save_path): os.makedirs(save_path)
            else: continue 
            
            for f in os.listdir(folder_path):
                # if f.split("_")[1] == "1":
                file_name = os.path.join(folder_path, f)
                save_name = os.path.join(save_path, f)
                compressFile(file_name, save_name)

    else:
        file_path = os.path.join(dir, filename)
        save_name = "1_resize_compressed_" + filename
        compressFile(file_path, save_name)

def compressFile(file_path, save_path, new_size=(128,128)):
    image = Image.open(file_path)
    image = image.resize(new_size)
    image.save(save_path, "JPEG", optimize=True, quality=20)

# compress(dir="./../assets/images_highres/pizza boy/scheduled/", filename="a cute young boy eating pizza, happy, Rossdraws_50_3_20.0.jpg")
compress("./../assets/images_highres/", "./../assets/images/")