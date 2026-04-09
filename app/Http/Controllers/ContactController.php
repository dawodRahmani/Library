<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        ContactMessage::create($data);

        return back()->with('success', 'پیام شما با موفقیت ارسال شد.');
    }

    public function adminIndex(): Response
    {
        $messages = ContactMessage::latest()->paginate(20);

        return Inertia::render('admin/messages/index', [
            'messages'     => $messages,
            'unread_count' => ContactMessage::where('is_read', false)->count(),
        ]);
    }

    public function markRead(ContactMessage $message): RedirectResponse
    {
        $message->update(['is_read' => true]);

        return back();
    }

    public function markUnread(ContactMessage $message): RedirectResponse
    {
        $message->update(['is_read' => false]);

        return back();
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        return back()->with('success', 'پیام حذف شد.');
    }
}
