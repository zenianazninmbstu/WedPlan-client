
"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Upload,
  X,
  Image,
  Trash2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function AddServicePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [imagePosition, setImagePosition] = useState({
    x: 50,
    y: 50,
  });

  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef<{
    x: number;
    y: number;
    positionX: number;
    positionY: number;
  } | null>(null);

  const previewBoxRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  // Authentication check
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
    } else if (session.user.role !== "vendor") {
      router.replace("/");
    }
  }, [session, isPending, router]);

  // Image preview
  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  // Select image
  const handleImageSelect = (selectedImage?: File) => {
    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setImage(selectedImage);
    setImagePosition({ x: 50, y: 50 });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Drag image to change position
  const handleImagePointerDown = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (!image) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      positionX: imagePosition.x,
      positionY: imagePosition.y,
    };

    setIsDragging(true);
  };

  const handleImagePointerMove = (
    event: PointerEvent<HTMLDivElement>
  ) => {
    if (!dragStart.current || !previewBoxRef.current) return;

    const rect = previewBoxRef.current.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const moveX = event.clientX - dragStart.current.x;
    const moveY = event.clientY - dragStart.current.y;

    const newX = Math.max(
      0,
      Math.min(
        100,
        dragStart.current.positionX -
          (moveX / rect.width) * 100
      )
    );

    const newY = Math.max(
      0,
      Math.min(
        100,
        dragStart.current.positionY -
          (moveY / rect.height) * 100
      )
    );

    setImagePosition({ x: newX, y: newY });
  };

  const handleImagePointerUp = () => {
    dragStart.current = null;
    setIsDragging(false);
  };

  // Create cropped image
  const createCroppedImage = async (): Promise<File | null> => {
    if (!image) return null;

    const objectUrl = URL.createObjectURL(image);
    const sourceImage = new window.Image();

    try {
      await new Promise<void>((resolve, reject) => {
        sourceImage.onload = () => resolve();
        sourceImage.onerror = () =>
          reject(new Error("Could not load image."));
        sourceImage.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 675;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not process the selected image.");
      }

      const scale = Math.max(
        canvas.width / sourceImage.naturalWidth,
        canvas.height / sourceImage.naturalHeight
      );

      const renderedWidth = sourceImage.naturalWidth * scale;
      const renderedHeight = sourceImage.naturalHeight * scale;

      const offsetX =
        (canvas.width - renderedWidth) * (imagePosition.x / 100);

      const offsetY =
        (canvas.height - renderedHeight) * (imagePosition.y / 100);

      context.drawImage(
        sourceImage,
        offsetX,
        offsetY,
        renderedWidth,
        renderedHeight
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Image processing failed."));
            }
          },
          "image/jpeg",
          0.92
        );
      });

      return new File([blob], "wedplan-service-image.jpg", {
        type: "image/jpeg",
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImage(null);
    setImagePosition({ x: 50, y: 50 });
    dragStart.current = null;
    setIsDragging(false);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit service
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!image) {
      setError("Please select a service image.");
      return;
    }

    if (Number(price) <= 0 || !Number.isFinite(Number(price))) {
      setError("Please enter a valid price.");
      return;
    }

    try {
      setLoading(true);

      const tokenResponse = await authClient.token();

      if (tokenResponse.error || !tokenResponse.data?.token) {
        throw new Error("Authentication failed. Please login again.");
      }

      const token = tokenResponse.data.token;

      // Crop image
      const croppedImage = await createCroppedImage();

      if (!croppedImage) {
        throw new Error("Could not process the selected image.");
      }

      // Upload image to ImgBB
      const imageFormData = new FormData();
      imageFormData.append("image", croppedImage);

      const imageResponse = await fetch(`${apiUrl}/api/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      });

      const imageData = await imageResponse.json();

      if (!imageResponse.ok || !imageData.success) {
        throw new Error(imageData.message || "Image upload failed.");
      }

      // Create service
      const serviceData = {
        name: name.trim(),
        description: description.trim(),
        category,
        price: Number(price),
        location: location.trim(),
        images: [imageData.imageUrl],
      };

      const serviceResponse = await fetch(`${apiUrl}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      });

      const result = await serviceResponse.json();

      if (!serviceResponse.ok || !result.success) {
        throw new Error(result.message || "Failed to submit service.");
      }

      setMessage("Your service has been submitted for admin approval!");

      // Clear form
      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setLocation("");
      setImage(null);
      setImagePosition({ x: 50, y: 50 });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session || session.user.role !== "vendor") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5EE]">
        <p className="text-[#174C3C]">Loading...</p>
      </div>
    );
  }

  if (session.user.isBlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
        <p className="text-center text-red-600">
          Your account is blocked. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EE] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-2xl">

        {/* Back to Dashboard */}
        <Link
          href="/dashboard/vendor"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#174C3C] transition hover:text-[#A47C55]"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Main Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-[#E8E1D5] bg-white p-5 shadow-[0_12px_40px_rgba(23,76,60,0.07)] sm:space-y-6 sm:p-7"
        >
          {/* Header */}
          <div className="border-b border-[#EAE3D8] pb-6 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#A47C55]">
              Vendor Dashboard
            </p>

            <h1 className="mt-2 font-playfair text-3xl font-bold text-[#174C3C] sm:text-4xl">
              Add Wedding Service
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#7B827D]">
              Share your wedding service with customers looking for
              trusted professionals.
            </p>
          </div>

          {/* Service Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#174C3C]">
              Service Name *
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Example: Premium Wedding Photography"
              required
              maxLength={100}
              className="w-full rounded-xl border border-[#E8E1D5] bg-[#FDFCF9] px-4 py-3 text-sm text-[#263C32] outline-none transition placeholder:text-[#A5AAA5] focus:border-[#174C3C] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/10"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#174C3C]">
              Service Description *
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe your wedding service..."
              required
              rows={4}
              maxLength={2000}
              className="w-full resize-y rounded-xl border border-[#E8E1D5] bg-[#FDFCF9] px-4 py-3 text-sm text-[#263C32] outline-none transition placeholder:text-[#A5AAA5] focus:border-[#174C3C] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/10"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#174C3C]">
              Service Category *
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
              className="w-full rounded-xl border border-[#E8E1D5] bg-[#FDFCF9] px-4 py-3 text-sm text-[#263C32] outline-none transition focus:border-[#174C3C] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/10"
            >
              <option value="">Select a category</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Price and Location */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#174C3C]">
                Price (BDT) *
              </label>

              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Example: 15000"
                min="1"
                step="0.01"
                required
                className="w-full rounded-xl border border-[#E8E1D5] bg-[#FDFCF9] px-4 py-3 text-sm text-[#263C32] outline-none transition placeholder:text-[#A5AAA5] focus:border-[#174C3C] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#174C3C]">
                Location *
              </label>

              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Example: Dhaka"
                required
                maxLength={100}
                className="w-full rounded-xl border border-[#E8E1D5] bg-[#FDFCF9] px-4 py-3 text-sm text-[#263C32] outline-none transition placeholder:text-[#A5AAA5] focus:border-[#174C3C] focus:bg-white focus:ring-2 focus:ring-[#174C3C]/10"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#174C3C]">
              Service Image *
            </label>

            <div
              ref={previewBoxRef}
              onPointerDown={handleImagePointerDown}
              onPointerMove={handleImagePointerMove}
              onPointerUp={handleImagePointerUp}
              onPointerCancel={handleImagePointerUp}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                handleImageSelect(event.dataTransfer.files?.[0]);
              }}
              className={`relative aspect-video w-full overflow-hidden rounded-xl border-2 border-dashed border-[#C9D9CE] bg-[#F8F5EE] transition ${
                image
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-pointer hover:border-[#174C3C] hover:bg-[#F2F6F1]"
              }`}
              style={{
                touchAction: image ? "none" : "auto",
              }}
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Service image preview"
                    draggable={false}
                    className="pointer-events-none h-full w-full select-none object-cover"
                    style={{
                      objectPosition: `${imagePosition.x}% ${imagePosition.y}%`,
                    }}
                  />

                  <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white">
                    Drag image to adjust position
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-full w-full flex-col items-center justify-center px-4 text-center"
                >
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#E5EFE8] text-[#174C3C]">
                    <ImagePlus size={26} />
                  </div>

                  <p className="text-sm font-semibold text-[#174C3C]">
                    Upload your service photo
                  </p>

                  <p className="mt-2 text-xs text-[#7B827D]">
                    Drag and drop an image here or select from your device
                  </p>

                  <p className="mt-1 text-xs text-[#9A9F9B]">
                    JPG, PNG or WEBP · Maximum 5 MB
                  </p>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                handleImageSelect(event.target.files?.[0])
              }
              className="hidden"
            />

            {/* Image Actions */}
            {image && (
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#174C3C] px-5 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#23634F] hover:shadow-md"
                >
                  <Image size={17} />
                  Change Photo
                </button>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition duration-200 hover:border-red-300 hover:bg-red-100"
                >
                  <Trash2 size={17} />
                  Remove Photo
                </button>
              </div>
            )}

            <p className="mt-3 text-xs leading-5 text-[#8A918C]">
              Select one photo. You can drag the image inside the preview
              to adjust the visible area.
            </p>
          </div>

          {/* Messages */}
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
              <p className="mt-1 text-xs">
                Your service will appear publicly after admin approval
                and activation.
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#174C3C] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition duration-300 hover:bg-[#A47C55] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Submitting Service...
              </>
            ) : (
              <>
                <Upload size={18} />
                Submit for Approval
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
