'use client'
import { closeModal } from '../features/common/modalSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useEffect } from 'react'

function ModalLayout() {
  const { isOpen, title, bodyContent, response } = useAppSelector((state) => state.modal)
  const dispatch = useAppDispatch()

  const close = () => {
    dispatch(closeModal())
  }
  useEffect(() => {
    console.log('hellloooooo')
    console.log({ isOpen, title, bodyContent, response })
  }, [isOpen, title, bodyContent, response])

  return (
    <>
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className={`modal-box max-w-5xl`}>
          <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => close()}>
            ✕
          </button>
          <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>

          <div>{bodyContent}</div>
          <div>{response}</div>
        </div>
      </div>
    </>
  )
}

export default ModalLayout
