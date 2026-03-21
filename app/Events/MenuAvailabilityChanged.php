<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MenuAvailabilityChanged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly int $itemId,
        public readonly bool $isAvailable,
    ) {}

    public function broadcastOn(): array
    {
        return [new Channel('public-restaurant')];
    }

    public function broadcastAs(): string
    {
        return 'MenuAvailabilityChanged';
    }

    public function broadcastWith(): array
    {
        return [
            'item_id'      => $this->itemId,
            'is_available' => $this->isAvailable,
        ];
    }
}
