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

def compress_dir(orig_dir, new_dir, size):
    for folder_name in os.listdir(orig_dir):
        if folder_name == ".DS_Store": continue
        print("Start compressing the folder", folder_name)
        orig_folder_name = os.path.join(orig_dir, folder_name)
        new_folder_name = os.path.join(new_dir, folder_name)
        if not os.path.exists(new_folder_name):
            os.makedirs(new_folder_name)
        for f in os.listdir(orig_folder_name):
            orig_f = os.path.join(orig_folder_name, f)
            new_f = os.path.join(new_folder_name, f)
            compressFile(orig_f, new_f, size)


def compressFile(file_path, save_path, new_size=(128,128)):
    image = Image.open(file_path)
    image = image.resize(new_size)
    image.save(save_path, "JPEG", optimize=True, quality=70)

compress_dir("./../assets/latent_viz_orig/", "./../assets/latent_viz/", (64,64))
# compress_dir("./../assets/img_orig/", "./../assets/img/", (256,256))