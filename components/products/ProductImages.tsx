import React, { useState } from 'react';
import ImagePicker from '../ui/ImagePicker';
import toast from 'react-hot-toast';
import { ProductImage } from '@prisma/client';
import { supabase } from '../../utils/supabaseClient';
import { useClient } from 'react-supabase';
import useSWR from 'swr';
import Loading from '../../components/ui/Loading';
import Image from 'next/image';
import ImageModal from './ImageModal';
import axios from 'axios';
import { Icon } from '@iconify/react';

type Props = {
  productId: number;
};

export default function ProductImages({ productId }: Props) {
  const client = useClient();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  const {
    data: images = [],
    isLoading: imagesLoading,
    mutate,
  } = useSWR<ProductImage[]>(productId ? `/api/product-images?productId=${productId}` : null);

  async function uploadImages(filePath: string, file: File) {
    const { error: uploadError } = await client.storage.from('products').upload(filePath, file);
    if (uploadError) {
      toast.error('Ocurrió un error al subir las imágenes, inténtalo de nuevo');
      throw uploadError;
    }
  }

  async function insertImage(filePath: string) {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .insert([{ image_url: filePath, product_id: productId }]);
      if (error) {
        toast.error('Ocurrió un error al insertar la imagen en el producto, inténtalo de nuevo');
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploadLoading(true);
      const target = e.currentTarget as HTMLInputElement;
      const fileList = target.files;

      if (!fileList || !fileList.length) {
        toast.error('You must select an image to upload.');
        return;
      }

      const files = Array.from(fileList);
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${productId}/${fileName}`;

        await uploadImages(filePath, file);
        await insertImage(filePath);
      }

      mutate();
      e.target.value = '';
      toast.success('Imágenes agregadas al producto');
    } catch (error) {
    } finally {
      setUploadLoading(false);
    }
  }

  async function onRemove(id: number, url: string) {
    try {
      await axios.delete(`/api/product-images/${id}`);
      await supabase.storage.from('products').remove([url]);
      mutate(images.filter((i) => Number(i.id) !== id));
      toast.success('Se ha eliminado la imagen');
    } catch (error) {
      toast.error('No se pudo eliminar la imagen');
    } finally {
      setSelectedImage(null);
    }
  }

  return (
    <div>
      <Loading isLoading={uploadLoading} />
      {selectedImage && (
        <ImageModal
          onRemove={onRemove}
          closeHandler={() => setSelectedImage(null)}
          visible={true}
          image={selectedImage}
        />
      )}
      {images.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((i) => (
            <Image
              src={`https://fcriikwtewdpzbifahnv.supabase.co/storage/v1/object/public/products/${i.image_url}?width=200`}
              alt={`product image: ${i.image_url}`}
              onClick={() => setSelectedImage(i)}
              className="object-cover rounded-2xl hover:shadow-xl cursor-pointer transition-opacity duration-300"
              width={100}
              height={100}
            />
          ))}
        </div>
      ) : null}
      <ImagePicker onChange={onInputChange} />
    </div>
  );
}
