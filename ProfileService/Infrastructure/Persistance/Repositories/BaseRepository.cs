using Application.Interfaces;
using Infrastructure.Persistance.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Persistance.Repositories;
public abstract class BaseRepository<TEntity>(DataContext dataContext) : IBaseRepository<TEntity> where TEntity : class
{
    protected readonly DataContext _dataContext = dataContext;
    private readonly DbSet<TEntity> _dbSet = dataContext.Set<TEntity>();

    public virtual async Task<int> SaveAsync()
    {
        try
        {
            // Save changes to the database
            var changes = await _dataContext.SaveChangesAsync();

            // Return the number of state entries written to the database
            return changes;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while saving changes: {ex.Message}");
            return -1;
        }
    }

    // Create
    public virtual async Task<TEntity> AddAsync(TEntity entity)
    {
        if (entity == null)
            return null!;

        try
        {
            // Add entity to the DbSet
            var success = await _dbSet.AddAsync(entity);
            if (success != null)
                return success.Entity;

            return null!;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while adding the entity: {ex.Message}");
            return null!;
        }
    }

    // Read
    public virtual async Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> expression)
    {
        if (expression == null)
            return null!;

        try
        {
            var entity = await _dbSet.FirstOrDefaultAsync(expression);
            if (entity == null)
                return null!;

            return entity!;

        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while retrieving entities: {ex.Message}");
            return null!;
        }
    }

    public virtual async Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>>? expression = null)
    {
        try
        {
            if (expression != null)
            {
                var entities = await _dbSet.Where(expression).ToListAsync();
                return entities;
            }
            else
            {
                var entities = await _dbSet.ToListAsync();
                return entities;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while retrieving entities: {ex.Message}");
            return new List<TEntity>();
        }
    }


    // Update
    public virtual async Task<TEntity> UpdateAsync(TEntity entity)
    {
        if (entity == null)
            return null!;
        try
        {
            var updatedEntity = _dbSet.Update(entity);
            if (updatedEntity != null)
                return updatedEntity.Entity;
            return null!;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while updating the entity: {ex.Message}");
            return null!;
        }
    }

    // Delete
    public virtual async Task<bool> DeleteAsync(TEntity entity)
    {
        if (entity == null)
            return false;
        try
        {
            var deletedEntity = _dbSet.Remove(entity);
            if (deletedEntity != null)
                return true;
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred while deleting the entity: {ex.Message}");
            return false;
        }
    }
}