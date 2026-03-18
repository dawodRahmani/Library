<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TableStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $tableId,
        public readonly string $status,
        public readonly ?int $activeOrderId,
    ) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('restaurant')];
    }

    public function broadcastAs(): string
    {
        return 'TableStatusChanged';
    }

    public function broadcastWith(): array
    {
        return [
            'table_id'        => $this->tableId,
            'status'          => $this->status,
            'active_order_id' => $this->activeOrderId,
        ];
    }
}
