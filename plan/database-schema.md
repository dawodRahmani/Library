# Database Schema Plan

## Tables

### categories
| Column     | Type         | Notes                |
|------------|--------------|----------------------|
| id         | BIGINT PK    | Auto increment       |
| name       | JSON         | Translatable name    |
| sort_order | INT          | Display order        |
| created_at | TIMESTAMP    |                      |
| updated_at | TIMESTAMP    |                      |

### food_items
| Column      | Type         | Notes                     |
|-------------|--------------|---------------------------|
| id          | BIGINT PK    | Auto increment            |
| category_id | BIGINT FK    | → categories.id           |
| name        | JSON         | Translatable name         |
| price       | DECIMAL(10,2)| Price in local currency   |
| image       | VARCHAR      | Optional image path       |
| is_available| BOOLEAN      | In stock or not           |
| sort_order  | INT          | Display order             |
| created_at  | TIMESTAMP    |                           |
| updated_at  | TIMESTAMP    |                           |

### tables
| Column     | Type         | Notes                          |
|------------|--------------|--------------------------------|
| id         | BIGINT PK    | Auto increment                 |
| number     | INT          | Table number                   |
| name       | VARCHAR      | Optional label (e.g., "VIP 1") |
| capacity   | INT          | Number of seats                |
| status     | ENUM         | available, occupied            |
| created_at | TIMESTAMP    |                                |
| updated_at | TIMESTAMP    |                                |

### orders
| Column      | Type         | Notes                                      |
|-------------|--------------|---------------------------------------------|
| id          | BIGINT PK    | Auto increment                              |
| table_id    | BIGINT FK    | → tables.id                                 |
| order_number| VARCHAR      | Unique order reference                      |
| status      | ENUM         | pending, in_kitchen, ready, served, paid, cancelled |
| total_amount| DECIMAL(10,2)| Auto-calculated total                       |
| notes       | TEXT         | Optional order notes                        |
| created_by  | BIGINT FK    | → employees.id (waiter/manager)             |
| paid_at     | TIMESTAMP    | When payment was made                       |
| created_at  | TIMESTAMP    |                                             |
| updated_at  | TIMESTAMP    |                                             |

### order_items
| Column       | Type         | Notes                    |
|--------------|--------------|--------------------------|
| id           | BIGINT PK    | Auto increment           |
| order_id     | BIGINT FK    | → orders.id              |
| food_item_id | BIGINT FK    | → food_items.id          |
| quantity     | INT          | Number of items          |
| unit_price   | DECIMAL(10,2)| Price at time of order   |
| subtotal     | DECIMAL(10,2)| quantity × unit_price    |
| notes        | VARCHAR      | Special instructions     |
| created_at   | TIMESTAMP    |                          |
| updated_at   | TIMESTAMP    |                          |

### employees
| Column     | Type         | Notes                              |
|------------|--------------|-------------------------------------|
| id         | BIGINT PK    | Auto increment                     |
| name       | VARCHAR      |                                     |
| role       | ENUM         | manager, waiter, chef, cashier     |
| phone      | VARCHAR      |                                     |
| hire_date  | DATE         |                                     |
| is_active  | BOOLEAN      | Currently employed                  |
| created_at | TIMESTAMP    |                                     |
| updated_at | TIMESTAMP    |                                     |

### salaries
| Column      | Type         | Notes                  |
|-------------|--------------|------------------------|
| id          | BIGINT PK    | Auto increment         |
| employee_id | BIGINT FK    | → employees.id         |
| amount      | DECIMAL(10,2)| Salary amount          |
| payment_date| DATE         | Date of payment        |
| month       | VARCHAR      | e.g., "1404-12"       |
| notes       | TEXT         | Optional notes         |
| created_at  | TIMESTAMP    |                        |
| updated_at  | TIMESTAMP    |                        |

### expenses
| Column     | Type         | Notes                                        |
|------------|--------------|----------------------------------------------|
| id         | BIGINT PK    | Auto increment                               |
| category   | ENUM         | groceries, rent, electricity, gas, supplies, other |
| description| VARCHAR      | What the expense was for                     |
| amount     | DECIMAL(10,2)| Expense amount                               |
| date       | DATE         | Date of expense                              |
| notes      | TEXT         | Optional notes                               |
| created_at | TIMESTAMP    |                                              |
| updated_at | TIMESTAMP    |                                              |

## Relationships
- `categories` 1→N `food_items`
- `tables` 1→N `orders`
- `orders` 1→N `order_items`
- `food_items` 1→N `order_items`
- `employees` 1→N `orders` (created_by)
- `employees` 1→N `salaries`
