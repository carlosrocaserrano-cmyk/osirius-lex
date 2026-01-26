import FinancialDashboard from '@/components/finances/FinancialDashboard';
import { getFinancialStats, getRecentTransactions } from '@/actions/finance-actions';

export const dynamic = 'force-dynamic';

export default async function FinancesPage() {
    const stats = await getFinancialStats();
    const transactions = await getRecentTransactions();

    return (
        <div className="p-8 pb-32 max-w-7xl mx-auto">
            <FinancialDashboard
                stats={stats}
                transactions={transactions}
            />
        </div>
    );
}
