import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Avatar, Button } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import TweetCard from "./TweetCard";
import { createPost, getAllPosts } from "../../services/postService";
import { getProfile } from "../../services/profileService";

const validationSchema = Yup.object().shape({
  content: Yup.string().required("Tweet text is required"),
});

function HomeSection() {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, postsData] = await Promise.all([
          getProfile(),
          getAllPosts()
        ]);
        setProfile(profileData);
        setPosts(postsData);
        setError(null);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setUploadingImage(true);
      const newPost = await createPost(values.content, selectedImages.length > 0 ? selectedImages : null);
      setPosts([newPost, ...posts]);
      resetForm();
      setSelectedImages([]);
      setError(null);
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      content: "",
      images: null
    },
    onSubmit: handleSubmit,
    validationSchema,
  });

  const handleSelectImage = (event) => {
    const files = event.target.files;
    if (files) {
      const imageArray = Array.from(files);
      setSelectedImages(prev => [...prev, ...imageArray]);
    }
  };

  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5 ml-4 max-w-[600px]">
      <section>
        <h1 className="py-5 text-xl font-bold opacity-90">Home</h1>
      </section>

      <section className={`pb-10`}>
        <div>
          <Avatar
            alt={profile?.username || "username"}
            src={profile?.profileImage || undefined}
            width={30}
            height={30}
          />

          <div className="w-full">
            <form onSubmit={formik.handleSubmit}>
              <div>
                <input
                  type="text"
                  name="content"
                  placeholder="What is happening"
                  className={`border-none outline-none text-xl bg-transparent`}
                  {...formik.getFieldProps("content")}
                />
                {formik.errors.content && formik.touched.content && (
                  <span className="text-red-500">{formik.errors.content}</span>
                )}
              </div>

                  {selectedImages.length > 0 && (
                // CHANGED: Dynamic preview layout
                <div className="mt-2 max-w-[600px]">
                  {selectedImages.length === 1 ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedImages[0])}
                        alt="Preview"
                        className="w-full max-w-[600px] h-auto rounded-md object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(0)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className={`grid ${selectedImages.length >= 3 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2'} gap-1`}>
                      {selectedImages.slice(0, selectedImages.length >= 4 ? 3 : selectedImages.length).map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="w-full h-[150px] rounded-md object-cover"
                          />
                          {/* CHANGED: +1 overlay for 4 images */}
                          {selectedImages.length >= 4 && index === 2 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold rounded-md">
                              +{selectedImages.length - 3}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {error && <p className="text-red-500 mt-2">{error}</p>}

              <div className="flex justify-between items-center mt-5">
                <div className="flex space-x-5 items-center">
                  <label className="flex items-center space-x-2 rounded-md cursor-pointer">
                    <ImageIcon className="text-[#1d9bf0]" />
                    <input
                      type="file"
                      name="imageFile"
                      className="hidden"
                      onChange={handleSelectImage}
                      accept="image/*"
                      multiple
                    />
                  </label>
                  <FmdGoodIcon className="text-[#1d9bf0]" />
                  <TagFacesIcon className="text-[#1d9bf0]" />
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={uploadingImage || (!formik.values.content && selectedImages.length === 0)}
                    className="bg-black text-white rounded-full py-2 px-5" // CHANGED: Added Tailwind fallback
                    sx={{
                      width: "100%",
                      borderRadius: "20px",
                      paddingY: "8px",
                      paddingX: "20px",
                      backgroundColor: "#000000",
                     color: "white",
                      "&:hover": {
                        backgroundColor: "#333333", // CHANGED: Added hover state
                      },
                      "&.Mui-disabled": {
                        backgroundColor: "#666666",
                        color: "#cccccc",
                      },
                    }}
                  >
                    {uploadingImage ? "Posting..." : "Post"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      
      <section>
        {posts.length > 0 ? (
          posts.map((post) => (
            <TweetCard key={post.id} post={post} onPostDeleted={() => setPosts(posts.filter(p => p.id !== post.id))} />
          ))
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </section>
    </div>
  );
}

export default HomeSection;