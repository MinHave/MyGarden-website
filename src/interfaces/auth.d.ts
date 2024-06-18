interface IUser {
  id: string
  token: string
  refreshToken: string
  expires: string
  username: string
  name?: string // Add other user properties as needed
}
