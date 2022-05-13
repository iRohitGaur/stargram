import { IcRoundAdd } from "assets/Icons";
import { FC, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewPost } from "reducers/postsSlice";
import { useAxios } from "utils";
import TextareaAutosize from "react-textarea-autosize";
import { Grid as Loader } from "react-loader-spinner";
import "./createpost.css";

export const CreatePost: FC = () => {
  const [img, setImg] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<Blob | undefined>();
  const [imgLoader, setImgLoader] = useState(false);
  const [caption, setCaption] = useState("");
  const { loading, operation } = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);

  const handlePostPhoto = () => {
    fileInput.current?.click();
  };

  const handleImageSelected = async () => {
    if (fileInput.current?.files) {
      const postPic = fileInput.current.files[0];
      setImg(URL.createObjectURL(postPic));
      setSelectedImage(postPic);
    }
  };

  const handleUploadPost = () => {
    if (selectedImage) {
      const data = new FormData();
      data.append("file", selectedImage);
      data.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET ?? ""
      );

      setImgLoader(true);
      fetch(process.env.REACT_APP_CLOUDINARY_API_URL ?? "", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then(async (data) => {
          setImgLoader(false);
          const response = await operation({
            method: "post",
            url: "/createpost",
            data: { photo: data?.secure_url, caption },
          });
          if (response) {
            dispatch(addNewPost(response.post));
            navigate("/");
          }
        })
        .catch((err) => {
          setImgLoader(false);
          console.log("err", err);
        });
    }
  };

  return (
    <div className="new_post_wrapper">
      <div className="new_post_image" onClick={handlePostPhoto}>
        <input
          type="file"
          className="file_input"
          accept="image/*"
          ref={fileInput}
          onChange={handleImageSelected}
        />
        <img src={img} alt="" className="new_post_img" />
        {!img && (
          <div className="upload_image">
            <IcRoundAdd style={{ height: "5rem", width: "5rem" }} />
            <span>Upload Photo</span>
          </div>
        )}
      </div>
      <div className="caption_wrapper">
        <label htmlFor="caption">caption:</label>
        <TextareaAutosize
          minRows={2}
          name="caption"
          maxRows={5}
          className="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>
      <button className="create_post" onClick={handleUploadPost}>
        Create Post
      </button>
      {(imgLoader || loading) && (
        <div className="stg_loader">
          <Loader
            height="150"
            width="150"
            color="#1a8d1a"
            ariaLabel="loading"
          />
        </div>
      )}
    </div>
  );
};
