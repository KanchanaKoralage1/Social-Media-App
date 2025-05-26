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
    <div className="space-y-5 ml-[-40px]">
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
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="max-h-40 rounded-md"
                      />
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
                    disabled={uploadingImage || (!formik.values.content && selectedImages.length === 0)}
                    sx={{
                      width: "100%",
                      borderRadius: "20px",
                      paddingY: "8px",
                      paddingX: "20px",
                      backgroundColor: "#000000",
                      color: "white",
                    }}
                  >
                    {uploadingImage ? "Posting..." : "Tweet"}
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