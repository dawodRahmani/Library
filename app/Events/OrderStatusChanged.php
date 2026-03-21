<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $orderId,
        public readonly string $status,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('kitchen'),
            new PrivateChannel('restaurant'),
            new Channel('public-restaurant'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'OrderStatusChanged';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->orderId,
            'status'   => $this->status,
        ];
    }
}
