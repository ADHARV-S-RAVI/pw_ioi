# Troubleshooting: JSON Parse Error

## Error: "Failed to execute 'json' on 'Response': Unexpected end of JSON input"

This error means the frontend is trying to parse JSON from a response that doesn't contain valid JSON.

### Common Causes:

1. **Backend not running**
   - Check if backend is running on `http://localhost:8000`
   - Run: `cd backend && poetry run python auth_api.py`

2. **Backend crashed or returned HTML error page**
   - Check backend terminal for errors
   - Visit `http://localhost:8000/` in browser - should show JSON

3. **CORS issues**
   - Check browser console for CORS errors
   - Verify backend CORS allows `http://localhost:5173`

4. **Network connection failed**
   - Check if proxy is configured in `vite.config.js`
   - Verify frontend is running on port 5173

### How to Debug:

1. **Check backend is running:**
   ```bash
   curl http://localhost:8000/
   ```
   Should return: `{"message":"AlgoTix Auth API is running","users_count":0}`

2. **Test login endpoint:**
   ```bash
   curl -X POST http://localhost:8000/api/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
   ```

3. **Check browser Network tab:**
   - Open DevTools → Network tab
   - Try login/signup
   - Check the `/api/login` or `/api/signup` request
   - Look at Response tab - should be JSON

4. **Check console errors:**
   - Open browser DevTools → Console
   - Look for any error messages

### Fixed Issues:

✅ Better error handling in frontend (checks response before parsing JSON)
✅ Backend exception handlers ensure all errors return JSON
✅ Network error detection with helpful messages
✅ Content-type validation before JSON parsing

### If Still Having Issues:

1. Make sure both servers are running:
   - Backend: `cd backend && poetry run python auth_api.py`
   - Frontend: `cd frontend && npm run dev`

2. Clear browser cache and localStorage:
   ```javascript
   localStorage.clear()
   ```

3. Check backend logs for any Python errors

4. Verify ports:
   - Backend: 8000
   - Frontend: 5173
