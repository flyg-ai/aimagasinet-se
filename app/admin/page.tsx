import Link from 'next/link';
import { requireAdminPage } from '@/lib/admin/auth';
import { listArticles } from '@/lib/admin/articles';
import { adminConfig as C } from '@/lib/admin/config';
import { logoutAction, unpublishAction } from './actions';

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm', dateStyle: 'short', timeStyle: 'short' }) : '–';

export default async function AdminHome() {
  requireAdminPage();
  const articles = await listArticles(50);
  return (
    <div className="adm">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h1>Artiklar</h1>
        <div className="row">
          <Link className="btn" href="/admin/ny/">Ny artikel</Link>
          <form action={logoutAction}><button className="btn ghost" type="submit">Logga ut</button></form>
        </div>
      </div>
      <p className="hint">De {articles.length} senast ändrade artiklarna (bara nyheter och guider på toppnivå — recensioner och hubbar redigeras inte här). Avpublicering döljer artikeln men raderar den inte — publicera igen från redigeringen.</p>
      <table>
        <thead><tr><th>Rubrik</th><th>Kategori</th><th>Publicerad</th><th /></tr></thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.slug}>
              <td>
                <Link href={`/admin/redigera/${a.slug}/`}><b>{a.title}</b></Link>
                <div className="hint">{C.articleUrl(a.slug)}</div>
              </td>
              <td>{a.category}</td>
              <td>{a.publishedAt ? fmt(a.publishedAt) : <span className="over">Avpublicerad</span>}</td>
              <td>
                <div className="row">
                  {a.publishedAt && <a href={C.articleUrl(a.slug)} target="_blank" rel="noopener">Visa</a>}
                  {a.publishedAt && (
                    <form action={unpublishAction}>
                      <input type="hidden" name="slug" value={a.slug} />
                      <button className="btn ghost" type="submit" style={{ padding: '4px 10px' }}>Avpublicera</button>
                    </form>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
