import { closeModal } from '../features/common/modalSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import AddLeadModalBody from '../features/leads/components/add-lead-modal-body'
import ConfirmationModalBody from './confirmation-modal-body'
import { MODAL_BODY_TYPES } from '@/helper/constants'
import FilePreviewer from 'react-file-previewer'
import { useEffect } from 'react'

function ModalLayout() {
  const { isOpen, bodyType, size, extraObject, title } = useAppSelector((state) => state.modal)
  const dispatch = useAppDispatch()

  const close = () => {
    dispatch(closeModal())
  }
  useEffect(() => {
    console.log('hellloooooo')
  }, [bodyType])

  return (
    <>
      {/* The button to open modal */}

      {/* Put this part before </body> tag */}
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className={`modal-box  ${size === 'lg' ? 'max-w-5xl' : ''}`}>
          <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => close()}>
            ✕
          </button>
          <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>

          {/* Loading modal body according to different modal type */}
          {
            {
              [MODAL_BODY_TYPES.LEAD_ADD_NEW]: <AddLeadModalBody closeModal={close} extraObject={extraObject} />,
              [MODAL_BODY_TYPES.CONFIRMATION]: <ConfirmationModalBody extraObject={extraObject} closeModal={close} />,
              [MODAL_BODY_TYPES.FILE_VIEWER]: (
                <div>
                  {extraObject?.fileData && (
                    <FilePreviewer
                      file={{
                        data: extraObject.fileData,
                        // mimeType: 'application/pdf',
                        name: 'sample.pdf' // for download
                      }}
                    />
                  )}
                </div>
              ),
              [MODAL_BODY_TYPES.UPLOAD_FILE]: (
                <div>
                  {extraObject?.fileData && (
                    <FilePreviewer
                      file={{
                        data: extraObject.fileData,
                        // mimeType: 'application/pdf',
                        name: 'sample.pdf' // for download
                      }}
                    />
                  )}
                </div>
              )
            }[bodyType]
          }
        </div>
      </div>
    </>
  )
}

export default ModalLayout
