'use client'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { APP_NAME, APP_NAME_TITLE } from '@/helper/constants'
import TitleCard from '@/components/cards/title-card'
import { gql, useMutation, useQuery } from '@apollo/client'
import ErrorText from '@/components/typography/error-text'
import SuccessText from '@/components/typography/success-text'
import DocumentDuplicateIcon from '@heroicons/react/24/solid/DocumentDuplicateIcon'
import TrashIcon from '@heroicons/react/24/solid/TrashIcon'
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon'
import Head from 'next/head'
import Image from 'next/image'
import Header from '@/components/containers/header'

interface ShareTokenData {
  createdAt: string
  id: string
  token: string
  updatedAt: string
}

function ShareDocuments({ params }: { params: { token: string } }) {
  const shareToken = params.token
  const dispatch = useAppDispatch()
  const [fileBase64, setFileBase64] = useState<string>('')

  const VIEW_SHARE_BLOB = gql`
    query ViewSharedFileBlob($token: String!) {
      viewSharedFileBlob(token: $token)
    }
  `

  const { data: viewSharedFileBlobData, error: viewSharedFileBlobError } = useQuery(VIEW_SHARE_BLOB, {
    variables: { token: shareToken },
    context: { appTokenName: APP_NAME + ':token' }
  })

  useEffect(() => {
    dispatch(() => {
      const base64 = viewSharedFileBlobData?.viewSharedFileBlob
      console.log({ base64 })
      if (base64) {
        setFileBase64(base64)
      }
    })
  }, [viewSharedFileBlobData])

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col ">
          {/* <Header contentRef={} /> */}
          <main className="flex-1 overflow-y-auto md:pt-4 pt-4 px-6  bg-base-200">
            {fileBase64 && (
              <Image
                className="m-auto"
                alt="fileImage"
                width={700}
                height={700}
                src={`data:image/*;base64,${fileBase64}`}
              ></Image>
            )}
            <div className="h-16"></div>
          </main>
        </div>
      </div>
    </>
  )
}

export default ShareDocuments
