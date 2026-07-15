---
layout: default
title: Home
---

<link rel="stylesheet" href="{{ '/assets/style.css' | relative_url }}">

<header>
  <h1>{{ site.title }}</h1>
  <p>{{ site.description }}</p>
  <a href="{{ '/planner.html' | relative_url }}">Meal Planner &rarr;</a>
</header>

<main>
  <ul class="recipe-list">
    {% for recipe in site.recipes %}
    <li>
      <a href="{{ recipe.url | relative_url }}">{{ recipe.title }}</a>
      {% if recipe.tags %}
      <span class="tags">
        {% for tag in recipe.tags %}<span class="tag">{{ tag }}</span>{% endfor %}
      </span>
      {% endif %}
    </li>
    {% endfor %}
  </ul>
</main>
