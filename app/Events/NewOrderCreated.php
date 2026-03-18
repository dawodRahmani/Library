<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewOrderCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly array $order) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('kitchen'),
            new PrivateChannel('restaurant'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'NewOrderCreated';
    }

    public function broadcastWith(): array
    {
        return ['order' => $this->order];
    }
}
