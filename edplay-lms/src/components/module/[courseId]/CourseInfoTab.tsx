'use client';

import { useState, useEffect } from 'react';
import { trpc } from '~/utils/trpc';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};

interface CourseInfoTabProps {
  courseId: number;
  userRole: 'student' | 'teacher' | 'admin';
}

export default function CourseInfoTab({
  courseId,
  userRole,
}: CourseInfoTabProps) {
  const { data: course, refetch: refetchCourse } = trpc.course.getById.useQuery(
    { id: courseId },
  );
  const { data: posts = [], refetch } = trpc.post.getByCourseId.useQuery({
    courseId,
  });

  const updateCourse = trpc.course.update.useMutation();
  const createPost = trpc.post.create.useMutation();
  const deletePost = trpc.post.delete.useMutation();

  const [editMode, setEditMode] = useState(false);
  const [newPost, setNewPost] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (course) {
      setName(course.name);
      setDescription(course.description ?? '');
      setImagePreview(course.imageUrl ?? undefined);
    }
  }, [course]);

  const isSaveDisabled =
    name === '' &&
    description === (course?.description ?? '') &&
    selectedFile === null;

  const uploadImage = async (): Promise<string | undefined> => {
    if (!selectedFile) return undefined;
    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch('/api/upload-course-bg', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload gagal');

    return data.path as string;
  };

  const handleSave = async () => {
    try {
      let uploadedImageUrl = course?.imageUrl ?? undefined;
      if (selectedFile) {
        uploadedImageUrl = await uploadImage();
      }

      await updateCourse.mutateAsync({
        id: courseId,
        name,
        description,
        educationLevel: course?.educationLevel ?? 'SD',
        grade: course?.grade ?? 1,
        isActive: course?.isActive ?? true,
        imageUrl: uploadedImageUrl,
      });

      toast.success('Informasi kelas diperbarui');
      await refetchCourse();
      setEditMode(false);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui info kelas');
    }
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    try {
      await createPost.mutateAsync({ courseId, title: 'Post', text: newPost });
      toast.success('Post berhasil dikirim');
      setNewPost('');
      refetch();
    } catch {
      toast.error('Gagal mengirim post');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost.mutateAsync({ id: postId });
      toast.success('Post dihapus');
      refetch();
    } catch {
      toast.error('Gagal menghapus post');
    }
  };

  return (
    <div className="px-">
      <div className="flex flex-col md:flex-row gap-4 items-start bg-white p-4 rounded shadow-md">
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Course"
            className="rounded-lg object-cover w-full md:w-1/4 max-h-36"
          />
        )}

        <div className="flex-1 min-w-[300px]">
          <h2 className="text-xl font-bold mb-4">Informasi Kelas</h2>

          {userRole === 'teacher' || userRole === 'admin' ? (
            <>
              {editMode ? (
                <div className="space-y-4 mb-6">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Kelas"
                  />
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Deskripsi"
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Ganti Gambar Kelas
                    </label>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                  <Button onClick={handleSave} disabled={isSaveDisabled}>
                    Simpan Perubahan
                  </Button>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="font-semibold">Nama: {course?.name}</p>
                  <p className="text-gray-700">
                    Deskripsi: {course?.description || '-'}
                  </p>
                  <Button onClick={() => setEditMode(true)} className="mt-2">
                    Edit
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="mb-6">
              <p className="font-semibold">Nama: {course?.name}</p>
              <p className="text-gray-700">
                Deskripsi: {course?.description || '-'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2">
        <div className="space-y-2 bg-white p-4 rounded-md shadow-md mb-2">
          <h3 className="font-semibold text-lg">Buat Post</h3>
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Tulis informasi untuk siswa..."
          />
          <Button disabled={!newPost.trim()} onClick={handlePost}>Kirim</Button>
        </div>
        <h3 className="font-semibold text-lg mb-2">Post Informasi</h3>
        {posts.map((post: Post) => (
          <div
            key={post.id}
            className="relative border bg-white p-4 rounded-md shadow-md mb-2"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold">{post.title}</h3>
              {(userRole === 'teacher' || userRole === 'admin') && (
                <Trash2
                  size={20}
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDeletePost(post.id)}
                />
              )}
            </div>
            <p className="text-sm text-black mt-1">{post.text}</p>
            <p className="text-xs text-gray-500 mt-2">
              Diposting pada:{' '}
              {new Date(post.createdAt).toLocaleString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
