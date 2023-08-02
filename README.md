==== For front end boot up ====
1. cd  react_front_end
2.  npm install
3.  npm start

==== For backend boot up ====
1. cd django_backend
2. source venv/bin/activate
2. pip install -r requirements.txt
3. python manage.py runserver


=== For test ===
1. Boot up front end http://localhost:3000/ into web browser.
2. Monitor from the backend, http://127.0.0.1:8000/api/movies, with login user admin and password admin.
3. In front end, use default username and password. Click submit.
4. In search page, use default value. Click submit.
5. Click any 'Save' button. and observe the update in http://127.0.0.1:8000/api/movies, need to refresh that page of http://127.0.0.1:8000/api/movies.
6. Click the button "example's movies' to see user's movie list.
7. Click the button "Delete" and observe the update in http://127.0.0.1:8000/api/movies, need to refresh that page of http://127.0.0.1:8000/api/movies.
8. Click 'back to search' button. and Click 5 'Save' buttons to observe the banner.
9. Do the above and delete some user's records, and back to the search.
10. In search box, input anything you like to do the test.



=== Test Result ===
1. Tested Mac OS 13.4.1 successfully

