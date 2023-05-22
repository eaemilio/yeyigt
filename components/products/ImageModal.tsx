import { Button, Input, Modal, Text } from '@nextui-org/react';
import React from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { ProductImage } from '@prisma/client';

type Props = {
  onRemove: (id: number, url: string) => void;
  closeHandler: () => void;
  visible: boolean;
  image: ProductImage;
};

export default function ImageModal({ onRemove, closeHandler, visible, image }: Props) {
  return (
    <Modal closeButton aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
      <Modal.Header>
        <Text id="modal-title" size={18}>
          {image.image_url}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Image
          src={`https://fcriikwtewdpzbifahnv.supabase.co/storage/v1/object/public/products/${image.image_url}?width=600&height=1200`}
          alt={`product image: ${image.image_url}`}
          className="object-cover rounded-md cursor-pointer"
          width={600}
          height={1200}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button auto onPress={() => onRemove(Number(image.id), image.image_url)}>
          <Icon icon="iconamoon:trash-fill" fontSize={16} /> Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
