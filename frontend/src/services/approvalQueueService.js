import { buildApiUrl } from './api'


function getAuthHeaders() {

  const token = localStorage.getItem("token")

  console.log("APPROVAL TOKEN:", token)

  return {
    Authorization: `Bearer ${token}`,
  }
}


async function requestApprovalQueue(path, options = {}) {
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers ?? {}),
    },
  })

  if (!response.ok) {
    throw new Error('Approval queue request failed')
  }

  return response.json()
}


export async function getApprovalQueue() {
  return requestApprovalQueue('/approval-queue', {
    method: 'GET',
  })
}


export async function approveApprovalQueueItem(approvalId) {
  return requestApprovalQueue(`/approval-queue/${approvalId}/approve`, {
    method: 'PUT',
  })
}


export async function rejectApprovalQueueItem(approvalId) {
  return requestApprovalQueue(`/approval-queue/${approvalId}/reject`, {
    method: 'PUT',
  })
}