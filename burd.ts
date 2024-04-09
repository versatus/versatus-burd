import { ComputeInputs } from '@versatus/versatus-javascript'

import {
  buildCreateInstruction,
  buildProgramUpdateField,
  buildTokenDistributionInstruction,
  buildTokenUpdateField,
  buildTransferInstruction,
  buildUpdateInstruction,
} from '@versatus/versatus-javascript'
import { THIS } from '@versatus/versatus-javascript'
import {
  Program,
  ProgramUpdate,
} from '@versatus/versatus-javascript'
import {
  Address,
  AddressOrNamespace,
} from '@versatus/versatus-javascript'
import {
  TokenOrProgramUpdate,
  TokenUpdate,
} from '@versatus/versatus-javascript'
import { Outputs } from '@versatus/versatus-javascript'
import {
  getCurrentSupply,
  parseAvailableTokenIds,
  parseMetadata,
  parseProgramTokenInfo,
  parseTxInputs,
  validate,
  validateAndCreateJsonString,
} from '@versatus/versatus-javascript'

class Burd extends Program {
  constructor() {
    super()
    Object.assign(this.methodStrategies, {
      addUser: this.addUser.bind(this),
      create: this.create.bind(this),
      tweet: this.tweet.bind(this),
    })
  }

  addUser(computeInputs: ComputeInputs) {
    try {
      const txInputs = parseTxInputs(computeInputs)
      const { programId } = computeInputs.transaction
      const { address, username, handle, imgUrl } = txInputs

      const programTokenInfo = parseProgramTokenInfo(computeInputs)
      const programAccountData = computeInputs.accountInfo.programAccountData
      const currUsers = JSON.parse(programAccountData?.users)
      const userDataStr = validateAndCreateJsonString({
        address,
        username,
        handle,
        imgUrl,
      })

      const updatedUsers = {
        ...currUsers,
        [address]: userDataStr,
      }

      const dataStr = validateAndCreateJsonString(updatedUsers)

      const updateUserObject = buildTokenUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const programUpdateInstructions = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
            'tokenUpdate',
            new TokenUpdate(
                new AddressOrNamespace(THIS),
                new AddressOrNamespace(THIS),
                [updateUserObject]
            )
        ),
      })

      const tokenIds = parseAvailableTokenIds(computeInputs)

      if (!tokenIds) {
        throw new Error('No tokenIds available')
      }

      if (tokenIds.length === 0) {
        throw new Error('No tokenIds available')
      }

      const transferInstruction = buildTransferInstruction({
        from: programId,
        to: address,
        tokenAddress: programId,
        tokenIds: [tokenIds[0]],
      })

      return new Outputs(computeInputs, [
        programUpdateInstructions,
        transferInstruction,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }

  create(computeInputs: ComputeInputs) {
    try {
      const { transaction } = computeInputs
      const { from } = transaction
      const txInputs = parseTxInputs(computeInputs)
      let currSupply = getCurrentSupply(computeInputs)

      // metadata
      const metadata = parseMetadata(computeInputs)
      const { initializedSupply, totalSupply } = metadata

      // data
      const imgUrl = txInputs?.imgUrl
      const collection = txInputs?.collection
      const currentSupply = (
          currSupply + parseInt(initializedSupply)
      ).toString()

      const methods = 'addUser,create,tweet'

      validate(collection, 'missing collection')

      const metadataStr = validateAndCreateJsonString(metadata)

      const addProgramMetadata = buildProgramUpdateField({
        field: 'metadata',
        value: metadataStr,
        action: 'extend',
      })

      const dataValues = {
        type: 'non-fungible',
        imgUrl,
        users: '{}',
        tweets: '{}',
        methods,
      } as Record<string, string>

      const dataStr = validateAndCreateJsonString(dataValues)

      const addProgramData = buildProgramUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const programUpdateInstructions = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
            'programUpdate',
            new ProgramUpdate(new AddressOrNamespace(THIS), [
              addProgramMetadata,
              addProgramData,
            ])
        ),
      })

      const distributionInstruction = buildTokenDistributionInstruction({
        programId: THIS,
        initializedSupply,
        currentSupply,
        to: THIS,
        nonFungible: true,
      })

      const createInstruction = buildCreateInstruction({
        from,
        totalSupply,
        initializedSupply,
        programId: THIS,
        programOwner: from,
        programNamespace: THIS,
        distributionInstruction,
      })

      return new Outputs(computeInputs, [
        createInstruction,
        programUpdateInstructions,
      ]).toJson()
    } catch (e) {
      throw e
    }
  }

  tweet(computeInputs: ComputeInputs) {
    try {
      const { from } = computeInputs.transaction
      const txInputs = parseTxInputs(computeInputs)
      const { tweet } = txInputs

      validate(tweet, 'missing tweet')

      const currDate = new Date().toISOString()

      const updatedTweets = {
        [`tweet-${currDate}`]: tweet,
      }

      const dataStr = validateAndCreateJsonString(updatedTweets)

      const updateUserObject = buildTokenUpdateField({
        field: 'data',
        value: dataStr,
        action: 'extend',
      })

      const tokenUpdateInstruction = buildUpdateInstruction({
        update: new TokenOrProgramUpdate(
            'tokenUpdate',
            new TokenUpdate(
                new AddressOrNamespace(new Address(from)),
                new AddressOrNamespace(THIS),
                [updateUserObject]
            )
        ),
      })

      return new Outputs(computeInputs, [tokenUpdateInstruction]).toJson()
    } catch (e) {
      throw e
    }
  }
}

const start = (input: ComputeInputs) => {
  try {
    const contract = new Burd()
    return contract.start(input)
  } catch (e) {
    throw e
  }
}

process.stdin.setEncoding('utf8')

let data = ''

process.stdin.on('readable', () => {
  try {
    let chunk

    while ((chunk = process.stdin.read()) !== null) {
      data += chunk
    }
  } catch (e) {
    throw e
  }
})

process.stdin.on('end', () => {
  try {
    const parsedData = JSON.parse(data)
    const result = start(parsedData)
    process.stdout.write(JSON.stringify(result))
  } catch (err) {
    // @ts-ignore
    process.stdout.write(err.message)
  }
})
