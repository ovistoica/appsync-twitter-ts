import {
  AwsResourceCondition,
  AwsResourceDependsOn,
} from '@serverless/typescript'

export type TResource = {
  Type: string
  Properties?: {
    [k: string]: unknown
  }
  CreationPolicy?: {
    [k: string]: unknown
  }
  DeletionPolicy?: string
  DependsOn?: AwsResourceDependsOn
  Metadata?: {
    [k: string]: unknown
  }
  UpdatePolicy?: {
    [k: string]: unknown
  }
  UpdateReplacePolicy?: string
  Condition?: AwsResourceCondition
}
