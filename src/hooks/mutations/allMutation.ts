import { useMutation, useQueryClient } from "@tanstack/react-query"
import { post_requests } from "../helper/AxioHelper"


export const useClaimToken = (id: any) => {
  const queryClient = useQueryClient()

  const claimToken = useMutation({
    mutationFn: async () => {
      const token = (await localStorage.getItem("ku_token")) || ""
      return post_requests(`/tasks/claim-token/${id}/`, {}, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] })
      queryClient.invalidateQueries({ queryKey: ["tokenMined"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
  return claimToken
}




export const usePostComment = (id: any) => {
  const queryClient = useQueryClient()

  const postComment = useMutation({
    mutationFn: async (data: FormData) => {
      const token = (await localStorage.getItem("ku_token")) || ""
      return post_requests(`/news/comment/${id}/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] })
    },
  })

  return postComment
}


export const useLikePost = (id: any) => {
  const queryClient = useQueryClient()

  const likePost = useMutation({
    mutationFn: async () => {
      const token = (await localStorage.getItem("ku_token")) || ""
      return post_requests(`/news/${id}/like/`, {}, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["like"] })
    },
  })

  return likePost
}




export const useSetInvitationCode = () => {
  const queryClient = useQueryClient()

  const invitationCode = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("ku_token")) || ""
      return post_requests(`/users/set-invitation-code/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inviteCode"] })
    },
  })

  return invitationCode
}



export const useClaimMining = () => {
  const queryClient = useQueryClient()

  const claimMining = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("ku_token")) || ""
      return post_requests(`/mining/update-mining-activity`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tokenMined"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })

  return claimMining
}


export const useFeedBack = () => {
  const queryClient = useQueryClient()

  const feedbackMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const token = (await localStorage.getItem("ku_token")) || ""
      return post_requests(`/users/feedback/`, data, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] })
    },
  })

  return feedbackMutation
}


export const useChangePassword = () => {
  const queryClient = useQueryClient()
  const changePassword = useMutation({
    mutationFn: async (data: any) => {
      const token = (await localStorage.getItem("ku_token")) || ""
      return post_requests(`/users/change-password/`, data, token)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changePassword"] })
    }
  })

  return changePassword
}

export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  const deleteAccount = useMutation({
    mutationFn: async () => {
      const token = (await localStorage.getItem("ku_token")) || ""
      return post_requests(`/users/delete-account/`, {}, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deleteAccount"] })
    }
  })

  return deleteAccount
}