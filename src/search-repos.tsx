import { List, getPreferenceValues } from '@raycast/api'
import { useEffect, useState } from 'react'

import type { PreferencesState } from './types'
import { checkTokenScopes, useGithubRepos } from './api/github'
import RepositoryListItem from './components/RepositoryListItem'
import ConfigurationRequired from './components/ConfigurationRequired'
import InvalidToken from './components/InvalidToken'
import EmptyScreen from './components/EmptyScreen'

export default function SearchRepositories() {
  const [searchText, setSearchText] = useState('')
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenScopes, setTokenScopes] = useState<string[]>([])

  const preferences = getPreferenceValues<PreferencesState>()

  const orgs = preferences.organizations
    .split(',')
    .map((org) => org.trim())
    .filter(Boolean)

  // Check token validity on mount
  useEffect(() => {
    async function validateToken() {
      if (!preferences.githubToken) {
        setTokenValid(false)
        return
      }
      const { valid, scopes } = await checkTokenScopes(preferences.githubToken)
      setTokenValid(valid)
      setTokenScopes(scopes)
    }
    validateToken()
  }, [preferences.githubToken])

  const { repositories, isLoading, error } = useGithubRepos(searchText, preferences)

  if (!preferences.githubToken || orgs.length === 0) {
    return (
      <ConfigurationRequired
        missingToken={!preferences.githubToken}
        missingOrganizations={orgs.length === 0}
      />
    )
  }

  if (tokenValid === false) {
    return <InvalidToken scopes={tokenScopes} />
  }

  if (tokenValid === null) {
    return <List isLoading={true} searchBarPlaceholder="Validating token..." />
  }

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search repositories..."
      throttle
    >
      {repositories.length === 0 && !isLoading ? (
        <EmptyScreen error={error} hasSearchText={searchText.length > 0} />
      ) : (
        repositories.map((repo) => <RepositoryListItem key={repo.id} repo={repo} />)
      )}
    </List>
  )
}
