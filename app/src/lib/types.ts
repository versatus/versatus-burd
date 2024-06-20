import { InitTransaction } from '@versatus/versatus-javascript'

export interface Churp {
  id: string
  content: string
  posterAddress: string
  profileImageUrl: string
  username: string
  displayName: string
  dateTime: string
  likes: any[]
  comments?: Comment[] // Optional comments array
}

export interface Comment {
  id: number
  username: string
  displayName: string
  content: string
  profileImageUrl: string // Add profile image URL
}

export type WalletKeypairArray = WalletKeypair[]

export interface LasrWalletContextType {
  address: string
  isConnecting: boolean
  isRequestingAccount: boolean
  isSigning: boolean
  isSending: boolean
  isCalling: boolean
  isDecrypting: boolean
  isEncrypting: boolean
  accountInfo: any
  accountPrograms: any
  programs: ParsedProgram[]
  verseBalance: string
  ethBalance: string
  provider: any
  requestAccount: () => Promise<any>
  loaded: boolean
  connect: () => Promise<void>
  disconnect: () => void
  decryptMessage: (message: string) => Promise<any>
  encryptMessage: (message: string, encryptionPublicKey: string) => Promise<any>
  signMessage: (message: string) => Promise<any>
  call: (initTx: InitTransaction) => Promise<any>
  send: (initTx: InitTransaction) => Promise<any>
}

export interface WalletKeypair {
  mnemonic: string
  keypair: string
  secret_key: string
  public_key: string
  address: string
  userId: string
  password: string
}

export interface Program {
  programId: string
  ownerId: string
  ownerAddress: string
  balance: string
  metadata: any
  tokenIds: any[]
  allowance: any
  approvals: any
  data: any
  status: string
}

export interface ParsedProgram extends Omit<Program, 'balance' | 'metadata'> {
  balance: number
  address: string
  metadata: {
    name?: string
    symbol?: string
    totalSupply?: number
  }
  data: Record<string, any>
}

export interface ProgramMetadata {
  content_id: string
  initializedSupply: string
  name: string
  symbol: string
  to: string
  totalSupply: string
}

export interface Account {
  accountType: string
  programNamespace: any
  ownerAddress: string
  programs: Program[]
  nonce: string
  programAccountData: any
  programAccountMetadata: ProgramMetadata
  programAccountLinkedPrograms: any[]
}
