import { List, Action, ActionPanel, Icon, openExtensionPreferences, Image, Color } from '@raycast/api'
import type { GithubRepository } from '../types'

export default function RepositoryListItem({ repo }: { repo: GithubRepository }) {
  return (
    <List.Item
      key={repo.id}
      title={repo.name}
      subtitle={repo.description || repo.full_name}
      icon={{ source: repo.owner.avatar_url, mask: Image.Mask.RoundedRectangle, tooltip: `@${repo.owner.login}` }}
      accessories={
        [
          repo.language && { text: repo.language, tooltip: 'Language' },
          { icon: Icon.Calendar, tooltip: `Last Updated: ${new Date(repo.updated_at).toLocaleString()}` },
          { text: `${repo.stargazers_count}`, tooltip: 'Stars', icon: Icon.Star },
          repo.private
            ? { icon: { source: Icon.Lock, tintColor: Color.Blue }, tooltip: 'Private Repository' }
            : { icon: { source: Icon.LockUnlocked, tintColor: Color.Green }, tooltip: 'Public Repository' },
        ].filter(Boolean) as List.Item.Accessory[]
      }
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.OpenInBrowser url={repo.html_url} title="Open in Browser" />
            <Action.CopyToClipboard content={repo.html_url} title="Copy URL" />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action title="Open Preferences" onAction={openExtensionPreferences} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  )
}
