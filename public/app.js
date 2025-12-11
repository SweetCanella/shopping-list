async function loadItems() {
  try {
    const response = await fetch('/api/items');
    const items = await response.json();
    
    const container = document.getElementById('itemsContainer');
    
    if (items.length === 0) {
      container.innerHTML = '<p>Список покупок пуст</p>';
      return;
    }
    
    container.innerHTML = '';
    
    items.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = `item ${item.purchased ? 'purchased' : ''}`;
      itemElement.innerHTML = `
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-quantity">Количество: ${item.quantity}</div>
        </div>
        <div class="item-actions">
          <button class="toggle-btn" data-id="${item.id}">
            ${item.purchased ? 'Вернуть' : 'Купить'}
          </button>
          <button class="delete-btn" data-id="${item.id}">Удалить</button>
        </div>
      `;
      
      container.appendChild(itemElement);
    });

    document.querySelectorAll('.toggle-btn').forEach(button => {
      button.addEventListener('click', toggleItem);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteItem);
    });
    
  } catch (error) {
    console.error('Ошибка при загрузке списка покупок:', error);
    document.getElementById('itemsContainer').innerHTML = '<p>Ошибка при загрузке списка покупок</p>';
  }
}

async function addItem(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('itemName');
  const quantityInput = document.getElementById('itemQuantity');
  
  const newItem = {
    name: nameInput.value,
    quantity: parseInt(quantityInput.value) || 1
  };
  
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    });
    
    if (response.ok) {
      nameInput.value = '';
      quantityInput.value = '1';
      
      loadItems();
    } else {
      alert('Ошибка при добавлении покупки');
    }
  } catch (error) {
    console.error('Ошибка при добавлении покупки:', error);
    alert('Ошибка при добавлении покупки');
  }
}

async function toggleItem(event) {
  const itemId = event.target.getAttribute('data-id');
  
  try {
    const response = await fetch(`/api/items/${itemId}`);
    const item = await response.json();

    const updatedItem = {
      ...item,
      purchased: !item.purchased
    };

    const updateResponse = await fetch(`/api/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedItem)
    });
    
    if (updateResponse.ok) {
      loadItems();
    } else {
      alert('Ошибка при обновлении покупки');
    }
  } catch (error) {
    console.error('Ошибка при обновлении покупки:', error);
    alert('Ошибка при обновлении покупки');
  }
}

async function deleteItem(event) {
  const itemId = event.target.getAttribute('data-id');
  
  if (!confirm('Удалить эту покупку?')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/items/${itemId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      loadItems();
    } else {
      alert('Ошибка при удалении покупки');
    }
  } catch (error) {
    console.error('Ошибка при удалении покупки:', error);
    alert('Ошибка при удалении покупки');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadItems();
  document.getElementById('addForm').addEventListener('submit', addItem);
});