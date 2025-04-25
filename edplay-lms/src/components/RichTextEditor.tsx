import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function RichTextEditor({ content, onChange }: {
  content: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="bg-white rounded border">
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onChange}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
          ],
        }}
        formats={[
          'bold', 'italic', 'underline', 'strike',
          'list', 'bullet', 'link', 'image'
        ]}
      />
    </div>
  );
}
