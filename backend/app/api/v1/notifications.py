from fastapi import APIRouter, HTTPException
from typing import List
from app.core.db import get_db

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
@router.get("/")
def get_notifications():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM notifications ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    
    notifications = []
    for r in rows:
        notifications.append({
            "id": r["id"],
            "title": r["title"],
            "message": r["message"],
            "type": r["type"],
            "is_read": bool(r["is_read"]),
            "link_url": r["link_url"],
            "created_at": r["created_at"]
        })
    return notifications

@router.post("/{notification_id}/read")
def mark_read(notification_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", (notification_id,))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@router.delete("/{notification_id}")
def delete_notification(notification_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM notifications WHERE id = ?", (notification_id,))
    deleted = cursor.rowcount
    conn.commit()
    conn.close()

    if deleted == 0:
        raise HTTPException(status_code=404, detail="Notification not found")

    return {"status": "deleted", "id": notification_id}
