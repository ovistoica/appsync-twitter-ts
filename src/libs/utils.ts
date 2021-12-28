/**
 * Use similar syntax to yml
 *
 * Example:
 *
 * {Resource: GetAtt('UsersTable.Arn')}
 * Transforms to:
 *
 * {Resource: {"Fn::GetAtt": ["UsersTable", "Arn"]}}
 * @param resource
 * @constructor
 */
export function GetAtt(resource: string) {
  const resourceArray = resource.split('.')

  return {'Fn::GetAtt': resourceArray}
}
