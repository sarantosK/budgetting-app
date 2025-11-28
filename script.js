// Legacy vanilla JS budgeting script (pre-React).
 // Not used by the current React + TypeScript application.
 // Kept only for reference; do not include from index.html or Vite entry.

let transactions = [];
let currentFilter = 'all';

// Initialize app
function init() {
    loadTransactions();
    setupEventListeners();
    updateDisplay();
}

// Load transactions from localStorage
function loadTransactions() {
    try {
        const stored = localStorage.getItem('transactions');
        transactions = stored ? JSON.parse(stored) : [];
        // Validate loaded data
        if (!Array.isArray(transactions)) {
            transactions = [];
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
        transactions = [];
    }
}

// Save transactions to localStorage
function saveTransactions() {
    try {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving transactions:', error);
        alert('Failed to save transaction. Storage might be full.');
    }
}

// Add transaction
function addTransaction(description, amount, category, type) {
    if (!description || !amount || !category || !type) {
        return false;
    }
    
    const transaction = {
        id: Date.now(),
        description: description.trim(),
        amount: parseFloat(amount),
        category: category,
        type: type,
        date: new Date().toISOString()
    };
    
    transactions.push(transaction);
    saveTransactions();
    return true;
}

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    updateDisplay();
}

// Clear all transactions
function clearAllTransactions() {
    if (transactions.length === 0) {
        alert('No transactions to clear.');
        return;
    }
    
    if (confirm('Are you sure you want to delete all transactions? This cannot be undone.')) {
        transactions = [];
        saveTransactions();
        updateDisplay();
    }
}

// Get category emoji
function getCategoryEmoji(category) {
    const emojis = {
        'income': '💰',
        'food': '🍔',
        'transport': '🚗',
        'utilities': '💡',
        'entertainment': '🎮',
        'shopping': '🛍️',
        'health': '🏥',
        'other': '📦'
    };
    return emojis[category] || '📦';
}

// Display transactions
function displayTransactions(filter = 'all') {
    const transactionList = document.getElementById('transaction-list');
    if (!transactionList) return;
    
    let filteredTransactions = transactions;
    if (filter !== 'all') {
        filteredTransactions = transactions.filter(t => t.type === filter);
    }
    
    if (filteredTransactions.length === 0) {
        const message = filter === 'all' 
            ? 'No transactions yet. Add your first transaction above!'
            : `No ${filter} transactions found.`;
        
        transactionList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p class="empty-state-text">${message}</p>
            </div>
        `;
        return;
    }
    
    transactionList.innerHTML = filteredTransactions
        .sort((a, b) => b.id - a.id)
        .map(transaction => {
            const amount = Math.abs(transaction.amount);
            const sign = transaction.type === 'income' ? '+' : '-';
            
            return `
                <div class="transaction-item ${transaction.type}" style="animation: fadeInUp 0.4s ease-out">
                    <div class="transaction-info">
                        <div class="transaction-description">${escapeHtml(transaction.description)}</div>
                        <div class="transaction-category">${getCategoryEmoji(transaction.category)} ${transaction.category}</div>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${sign}$${amount.toFixed(2)}
                    </div>
                    <div class="transaction-actions">
                        <button class="icon-btn" onclick="deleteTransaction(${transaction.id})" title="Delete transaction" type="button">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update summary
function updateSummary() {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const balance = totalIncome - totalExpenses;
    
    const incomeEl = document.getElementById('total-income');
    const expensesEl = document.getElementById('total-expenses');
    const balanceEl = document.getElementById('balance');
    
    if (!incomeEl || !expensesEl || !balanceEl) return;
    
    const currentIncome = parseFloat(incomeEl.textContent.replace(/[$,]/g, '')) || 0;
    const currentExpenses = parseFloat(expensesEl.textContent.replace(/[$,]/g, '')) || 0;
    const currentBalance = parseFloat(balanceEl.textContent.replace(/[$,]/g, '')) || 0;
    
    animateValue(incomeEl, currentIncome, totalIncome, 500);
    animateValue(expensesEl, currentExpenses, totalExpenses, 500);
    animateValue(balanceEl, currentBalance, balance, 500);
    
    balanceEl.className = 'summary-value';
    if (balance > 0) balanceEl.classList.add('positive');
    if (balance < 0) balanceEl.classList.add('negative');
}

// Animate number values
function animateValue(element, start, end, duration) {
    if (!element) return;
    
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        element.textContent = '$' + current.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = '$' + end.toFixed(2);
        }
    }
    
    requestAnimationFrame(update);
}

// Update display
function updateDisplay() {
    displayTransactions(currentFilter);
    updateSummary();
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    const form = document.getElementById('transaction-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const description = document.getElementById('description').value.trim();
            const amountInput = document.getElementById('amount');
            const amount = parseFloat(amountInput.value);
            const category = document.getElementById('category').value;
            const type = document.getElementById('type').value;
            
            if (!description) {
                alert('Please enter a description.');
                return;
            }
            
            if (!amount || amount <= 0 || isNaN(amount)) {
                alert('Please enter a valid amount greater than 0.');
                amountInput.focus();
                return;
            }
            
            if (!category) {
                alert('Please select a category.');
                return;
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '✓ Added!';
            submitBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
            submitBtn.disabled = true;
            
            if (addTransaction(description, amount, category, type)) {
                updateDisplay();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    form.reset();
                }, 1000);
            } else {
                alert('Failed to add transaction.');
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }
        });
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            displayTransactions(currentFilter);
        });
    });
    
    // Clear all button
    const clearAllBtn = document.getElementById('clear-all');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllTransactions);
    }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============= Main Script =============
console.log('Budgeting App Script Loaded'); // Log message to indicate script is running