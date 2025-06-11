"use client"

import { useFormik } from "formik"
import { useState, useEffect } from "react"
import * as Yup from "yup"
import { Avatar, Button, IconButton, Divider } from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import FmdGoodIcon from "@mui/icons-material/FmdGood"
import TagFacesIcon from "@mui/icons-material/TagFaces"
import CloseIcon from "@mui/icons-material/Close"
import TweetCard from "./TweetCard"
import { createPost, getAllPosts } from "../../services/postService"
import { getProfile } from "../../services/profileService"

const validationSchema = Yup.object().shape({
  content: Yup.string().required("Tweet text is required"),
})

function HomeSection() {
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState("For you")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, postsData] = await Promise.all([getProfile(), getAllPosts()])
        setProfile(profileData)
        setPosts(postsData)
        setError(null)
      } catch (err) {
        setError("Failed to load data")
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setUploadingImage(true)
      const newPost = await createPost(values.content, selectedImages.length > 0 ? selectedImages : null)
      setPosts([newPost, ...posts])
      resetForm()
      setSelectedImages([])
      setError(null)
    } catch (err) {
      setError("Failed to create post")
      console.error(err)
    } finally {
      setUploadingImage(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      content: "",
      images: null,
    },
    onSubmit: handleSubmit,
    validationSchema,
  })

  const handleSelectImage = (event) => {
    const files = event.target.files
    if (files) {
      const imageArray = Array.from(files)
      setSelectedImages((prev) => [...prev, ...imageArray])
    }
  }

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border-x border-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">Home</h1>
        </div>

        {/* Tabs */}
        <div className="flex">
          <div
            className={`flex-1 py-4 text-center font-bold cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
              activeTab === "For you" ? "text-gray-900" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("For you")}
          >
            <span>For you</span>
            {activeTab === "For you" && <div className="h-1 w-16 bg-blue-500 rounded-full mx-auto mt-3"></div>}
          </div>
          <div
            className={`flex-1 py-4 text-center font-bold cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
              activeTab === "Following" ? "text-gray-900" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("Following")}
          >
            <span>Following</span>
            {activeTab === "Following" && <div className="h-1 w-16 bg-blue-500 rounded-full mx-auto mt-3"></div>}
          </div>
        </div>
      </div>

      {/* Tweet Composer */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex space-x-3">
          <Avatar
            alt={profile?.username || "username"}
            src={profile?.profileImage || undefined}
            sx={{
              width: 48,
              height: 48,
            }}
          />

          <div className="w-full">
            <form onSubmit={formik.handleSubmit}>
              <div>
                <textarea
                  name="content"
                  placeholder="What's happening?"
                  className="w-full border-none outline-none text-xl bg-transparent resize-none placeholder-gray-500"
                  rows={2}
                  {...formik.getFieldProps("content")}
                />
                {formik.errors.content && formik.touched.content && (
                  <span className="text-red-500 text-sm">{formik.errors.content}</span>
                )}
              </div>

              {/* Image Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-gray-100">
                  {selectedImages.length === 1 ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(selectedImages[0]) || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full max-h-[300px] object-cover"
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(0)}
                        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ) : (
                    <div
                      className={`grid ${
                        selectedImages.length === 2
                          ? "grid-cols-2"
                          : selectedImages.length === 3
                            ? "grid-cols-2 grid-rows-2"
                            : "grid-cols-2 grid-rows-2"
                      } gap-0.5`}
                    >
                      {selectedImages
                        .slice(0, selectedImages.length >= 4 ? 4 : selectedImages.length)
                        .map((image, index) => (
                          <div
                            key={index}
                            className={`relative ${
                              selectedImages.length === 3 && index === 0 ? "row-span-2" : ""
                            } overflow-hidden`}
                          >
                            <img
                              src={URL.createObjectURL(image) || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              style={{ height: selectedImages.length <= 2 ? "150px" : "120px" }}
                            />
                            {selectedImages.length > 4 && index === 3 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-bold">
                                +{selectedImages.length - 4}
                              </div>
                            )}
                            <IconButton
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-black/50 text-white hover:bg-black/70"
                              size="small"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

              <Divider sx={{ my: 2 }} />

              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  <IconButton
                    component="label"
                    sx={{
                      color: "#1DA1F2",
                      "&:hover": { backgroundColor: "rgba(29, 161, 242, 0.1)" },
                    }}
                  >
                    <ImageIcon fontSize="small" />
                    <input
                      type="file"
                      name="imageFile"
                      className="hidden"
                      onChange={handleSelectImage}
                      accept="image/*"
                      multiple
                    />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: "#1DA1F2",
                      "&:hover": { backgroundColor: "rgba(29, 161, 242, 0.1)" },
                    }}
                  >
                    <FmdGoodIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: "#1DA1F2",
                      "&:hover": { backgroundColor: "rgba(29, 161, 242, 0.1)" },
                    }}
                  >
                    <TagFacesIcon fontSize="small" />
                  </IconButton>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={uploadingImage || (!formik.values.content && selectedImages.length === 0)}
                  sx={{
                    borderRadius: "9999px",
                    py: 1,
                    px: 3,
                    textTransform: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    backgroundColor: "#1DA1F2",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#1a8cd8",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "#9BD0F9",
                      color: "#fff",
                    },
                  }}
                >
                  {uploadingImage ? "Posting..." : "Tweet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <TweetCard
              key={post.id}
              post={post}
              onPostDeleted={() => setPosts(posts.filter((p) => p.id !== post.id))}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">No tweets yet. Start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeSection