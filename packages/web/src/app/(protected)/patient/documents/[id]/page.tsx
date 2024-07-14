'use client'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/lib/hooks'
import { APP_NAME, APP_NAME_TITLE, WEB_URL } from '@/helper/constants'
import TitleCard from '@/components/cards/title-card'
import { gql, useMutation, useQuery } from '@apollo/client'
import ErrorText from '@/components/typography/error-text'
import SuccessText from '@/components/typography/success-text'
import DocumentDuplicateIcon from '@heroicons/react/24/solid/DocumentDuplicateIcon'
import TrashIcon from '@heroicons/react/24/solid/TrashIcon'
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon'
import Head from 'next/head'

interface ShareTokenData {
  createdAt: string
  id: string
  token: string
  updatedAt: string
}

function ShareDocuments({ params }: { params: { id: string } }) {
  const fileId = params.id
  const dispatch = useAppDispatch()
  const [shareTokenList, setShareTokenList] = useState<ShareTokenData[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  const LIST_SHARE_TOKENS = gql`
    query ListShareTokens($fileId: ID!) {
      listShareTokens(fileId: $fileId) {
        id
        token
        createdAt
        updatedAt
      }
    }
  `

  const CREATE_SHARE_TOKEN = gql`
    mutation CreateShareToken($fileId: ID!, $ttl: Int!) {
      createShareToken(fileId: $fileId, ttl: $ttl)
    }
  `
  const REVOKE_SHARE_TOKEN = gql`
    mutation RevokeShareToken($tokenId: ID!) {
      revokeShareToken(tokenId: $tokenId)
    }
  `

  const {
    data: listShareTokensData,
    error: listShareTokensError,
    refetch: listShareTokensRefetch
  } = useQuery(LIST_SHARE_TOKENS, {
    variables: { fileId },
    context: { appTokenName: APP_NAME + ':token' }
  })

  const [createShareTokenGql, { data: createShareTokenData, error: createShareTokenError }] = useMutation(
    CREATE_SHARE_TOKEN,
    {
      context: { appTokenName: APP_NAME + ':token' }
    }
  )

  const [revokeShareTokenGql, { data: revokeShareTokenData, error: revokeShareTokenError }] = useMutation(
    REVOKE_SHARE_TOKEN,
    {
      context: { appTokenName: APP_NAME + ':token' }
    }
  )

  useEffect(() => {
    dispatch(() => {
      const docsData = listShareTokensData?.listShareTokens
      if (docsData) {
        console.log({ docsData })
        setShareTokenList(docsData)
      }
    })
  }, [listShareTokensData, revokeShareTokenData])

  const createShareToken = async () => {
    setSuccessMessage('')
    setErrorMessage('')
    await createShareTokenGql({ variables: { fileId, ttl: 3600 * 5 } })
      .then(async (result) => {
        console.log({ result })
        setSuccessMessage('Token created successfully')
        await listShareTokensRefetch()
      })
      .catch((error) => {
        console.error({ error })
        setErrorMessage(error?.message)
      })
  }

  const revokeShareToken = async (tokenId: string) => {
    setSuccessMessage('')
    setErrorMessage('')
    await revokeShareTokenGql({ variables: { tokenId } })
      .then(async (result) => {
        console.log({ result })
        setSuccessMessage('Token deleted successfully')
        await listShareTokensRefetch()
      })
      .catch((error) => {
        console.error({ error })
        setErrorMessage(error?.message)
      })
  }

  return (
    <>
      <Head>
        <title>{APP_NAME_TITLE} | Patient - Share Token Documents</title>
      </Head>
      <TitleCard
        title={'Tokens ' + fileId}
        topMargin="mt-2"
        TopSideButtons={
          <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={createShareToken}>
              Create Token
            </button>
          </div>
        }
      >
        {!shareTokenList?.length && <ErrorText styleClass="mt-8">{'No Documents Found'}</ErrorText>}
        {shareTokenList?.length > 0 && (
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Open Link</th>
                  <th>Revoke</th>
                </tr>
              </thead>
              <tbody>
                {shareTokenList.map((shareToken: ShareTokenData, k: number) => (
                  <tr key={k}>
                    <td>{k + 1}</td>
                    <td>{shareToken.createdAt}</td>
                    <td>{shareToken.updatedAt}</td>
                    <td>
                      <button className="btn btn-square btn-ghost">
                        <a target="_blank" href={WEB_URL + '/view/' + shareToken.token}>
                          <ArrowTopRightOnSquareIcon className="w-5" />
                        </a>
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-square btn-ghost" onClick={() => revokeShareToken(shareToken.id)}>
                        <TrashIcon className="w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TitleCard>
      {errorMessage && <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>}
      {successMessage && <SuccessText styleClass="mt-8">{successMessage}</SuccessText>}
    </>
  )
}

export default ShareDocuments
