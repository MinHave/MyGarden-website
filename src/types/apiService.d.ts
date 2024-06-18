export interface inOptions {
  noAuth?: boolean
  headers?: { [key: string]: string }
  // Add other properties as needed
}

export interface credentials {
  username: string
  password: string
}

export interface activationChanges {
  username: string
  token: string
  password: string
}
